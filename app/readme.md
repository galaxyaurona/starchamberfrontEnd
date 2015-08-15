##Word of advice
>Do not touch .htacess, 404.html,favicon.ico,robot.txt,.buildignore and/or any .file if you absolutely know what you are doing.Alternatively, use commands specific to a file type.

#Index.html
Main page of the single page App. Should contain only 1 ng view and 1 controller at a time. Every time adding a new module (without 'yo angular:<component>', please go inside this index file and manually add in .js under proper section

#Folder:
 - Views: contain all the controller's template. For directive template, put in the directives folder
 - Images and styles: self-descriptive
 - Scripts:Contain all angularJS specific code.Refer to inner readme.md for more information
