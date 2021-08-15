# 99-axidraw
if [[ -z ${AXIDRAW_CONSOLE+x} ]]; then
  AXIDRAW_CLI_COLOR_CYAN='\033[0;36m'
  AXIDRAW_CLI_COLOR_RED='\033[0;31m'
  AXIDRAW_CLI_COLOR_NONE='\033[0m'

  echo -e "${AXIDRAW_CLI_COLOR_CYAN}Welcome to ${USER} on ${HOSTNAME}${AXIDRAW_CLI_COLOR_NONE}
" 
  
  if getent group axidraw | cut -d: -f4- | grep -q "\b${USER}\b"; then
       echo -e "Use the axicli command to control ${USER}. ${AXIDRAW_CLI_COLOR_RED}Do not use the -p, -P, --port, or --port_config opti$
"  
      alias axicli='/opt/venv-axidraw/bin/axicli --port `/usr/bin/readlink -f /dev/$USER` --port_config 0'
  fi
  AXIDRAW_CONSOLE=true
else
  AXIDRAW_CONSOLE=false
fi
