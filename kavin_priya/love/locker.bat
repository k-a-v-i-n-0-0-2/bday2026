@ECHO OFF
title Folder Locker
if EXIST "Locker" goto UNLOCK
if NOT EXIST Locker md Locker
:CONFIRM
echo Do you want to lock the folder (Y/N)?
set/p "cho=>"
if %cho%==Y goto LOCK
if %cho%==y goto LOCK
if %cho%==N goto END
if %cho%==n goto END
echo Invalid choice.
goto CONFIRM
:LOCK
ren Locker "Control Panel.{21EC2020-3AEA-1069-A2DD-08002B30309D}"
attrib +h +s "Control Panel.{21EC2020-3AEA-1069-A2DD-08002B30309D}"
echo Folder locked
goto END
:UNLOCK
echo Enter password to unlock:
set/p "pass=>"
if NOT %pass%==1234 goto FAIL
attrib -h -s "Control Panel.{21EC2020-3AEA-1069-A2DD-08002B30309D}"
ren "Control Panel.{21EC2020-3AEA-1069-A2DD-08002B30309D}" Locker
echo Folder unlocked
goto END
:FAIL
echo Invalid password
goto END
:END
