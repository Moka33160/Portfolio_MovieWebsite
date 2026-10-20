"""Local Anicard launcher. Place this file at the root of the Anicard project."""
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parent
WINDOWS = os.name == 'nt'


def main():
    backend = ROOT / 'backend'
    frontend = ROOT / 'frontend'
    python = backend / '.venv' / ('Scripts/python.exe' if WINDOWS else 'bin/python')
    vite = frontend / 'node_modules/vite/bin/vite.js'
    node = shutil.which('node')
    if not python.is_file() or not vite.is_file() or not node:
        print('Missing project or dependencies. Extract the launcher into the Anicard project root.\n'
              'Install Python backend dependencies and Node.js frontend dependencies first.\n'
              'See README-LANCEURS.txt and the project README.', file=sys.stderr)
        return 1
    for port in (8000, 5173):
        with socket.socket() as connection:
            if connection.connect_ex(('127.0.0.1', port)) == 0:
                print(f'Port {port} is already in use. Stop the existing service before starting Anicard.', file=sys.stderr)
                return 1
    if '--check' in sys.argv:
        print('Project files, runtime paths and local ports are available.')
        return 0
    env = os.environ.copy()
    env.setdefault('DATABASE_URL', 'sqlite:///./preview.db')
    services = []
    try:
        for module in ('alembic', 'app.seed'):
            args = [str(python), '-m', module]
            if module == 'alembic':
                args += ['upgrade', 'head']
            subprocess.run(args, cwd=backend, env=env, check=True)
        commands = [
            ('API', [str(python), '-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], backend),
            ('Import worker', [str(python), '-m', 'app.imports.cli', '--actor', 'local-worker', 'worker'], backend),
            ('Website', [node, str(vite), '--host', '127.0.0.1', '--port', '5173', '--strictPort'], frontend),
        ]
        for name, args, cwd in commands:
            options = {'creationflags': subprocess.CREATE_NEW_PROCESS_GROUP} if WINDOWS else {'start_new_session': True}
            services.append((name, subprocess.Popen(args, cwd=cwd, env=env, **options)))
        print('Anicard: http://127.0.0.1:5173\nAPI: http://127.0.0.1:8000/docs\nKeep this terminal open. Ctrl+C stops all services.', flush=True)
        while True:
            for name, process in services:
                if process.poll() is not None:
                    print(f'{name} stopped. Shutting down Anicard.', file=sys.stderr)
                    return process.returncode or 1
            time.sleep(0.5)
    except KeyboardInterrupt:
        return 0
    except (subprocess.CalledProcessError, OSError) as error:
        print(f'Anicard could not start: {error}', file=sys.stderr)
        return 1
    finally:
        for _, process in reversed(services):
            if process.poll() is not None:
                continue
            if WINDOWS:
                subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                try:
                    os.killpg(process.pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                if not WINDOWS:
                    try:
                        os.killpg(process.pid, signal.SIGKILL)
                    except ProcessLookupError:
                        pass
                process.wait()


if __name__ == '__main__':
    sys.exit(main())
