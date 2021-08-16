base:
  '*':
    - sudo-rules
    - system-util
  '* and not I@roles:axidraw-master and not G@id:sfci-pi1.cfa.cmu.edu':
    - match: compound
    - minion
  'roles:axidraw-kiosk':
    - match: pillar
    - axidraw-kiosk
  'roles:axidraw-master':
    - match: pillar
    - minion-master
    - axidraw-master
