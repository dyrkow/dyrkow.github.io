
`rsync -r dir/ dir2`
        ^
        |
    рекурсивно
   
синхронизировать **содержимое** файлов dir с содержимым таких же файлов в dir2

`rsync -r dir dir2`
синхронизирует папки создав иеархию `dir2/dir`

`rsync -anv -e "ssh -p 4122" test/ root@ip:/var/www/admin/site.rf/testsshdir`
