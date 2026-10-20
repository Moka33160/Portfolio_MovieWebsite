#!/bin/bash
set -u
cd "$(dirname "$0")"

bash scripts/dev.sh
status=$?

if [[ "$status" -ne 0 && "$status" -ne 130 && "$status" -ne 143 ]]; then
  printf '\nAnime Card did not start. Check the message above and the setup guide in README.md.\n'
  read -r -p 'Press Enter to close this window. '
fi

exit "$status"
