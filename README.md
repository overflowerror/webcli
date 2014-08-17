webcli
======

This is going to be a blogging-website designed for nerds.   
This is basically a terminal to a pseudo-operating-system where users can view files (blogs) of other users or create files themself via a unix-like command line interface.

Installation
------------

Take a look at /backend/config.php   
MySQL database has to exist.   
ENABLE_SETUP-switch has to be set to true.   
   
Then run /backend/setup.php. This will generate the complete database-structure.   
Don't forget to reset the ENABLE_SETUP-switch.

Usage
-----
  
The interface is based on UNIX-commands (_cd_, _ls_, mv, cp, mkdir, chmod, chown, rmdir, _su_, passwd, useradd, usermod, userdel, touch, less, nano, vim, ...) (italic commands are implemented at the moment). 
The default password for the root user is "toor". You can change it as you like to.   

Future
------

There will be so called comment-files, which can be used to leave comments on other posts.

But for now the most important task is to implement the basic commands.   

__File commands:__
- mv
- cp
- rm
- mkdir
- rmdir
- chmod
- chown
- touch

__User commands:__
- useradd
- usermod
- userdel
- passwd

__Editors, pager, etc:__
- less, more
- nano (eventually with different name)
- vim (eventually with different name)
