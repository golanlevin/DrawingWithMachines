base:
  'roles:axidraw-kiosk':
    - match: grain
    - minion
    - sudo-rules
    - system-util
    - axidraw-kiosk
  'roles:axidraw-master':
    - match: grain
    - minion-master
    - sudo-rules
    - system-util
#    - axidraw-master
