# discord-keyword-notifier
Uses Selenium to monitor channels that you don't have bot access to and sends alert emails to recipient

# note
in v0 some aspects are hardcoded for a specific use case so some code changes may be required to use for other purposes 

# how to use
- you need to environmental variables HOTMAIL_EMAIL and HOTMAIL_PWD with your hotmail email and password to send emails
- you can configure the keywords, channel and other variables in config.json
- install node and npm and run 'npm install && node keywordNotifier' in the project directory

# next steps
- query language to use more complex queries
- upgrade to typescript?
- move some hardcoded aspects to config so it works for all channels/servers
