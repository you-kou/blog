# 新版 Typora 破解方法

1. 下载并安装Typora
2. 打开 Typora 的安装路径，修改文件 LicenseIndex

    文件目录：Typora\resources\page-dist\static\js
    
    文件名：LicenseIndex.180dd4c7.4da8909c.chunk.js
    
    将文件中的
    
    ```text
    e.hasActivated="true"==e.hasActivated
    ```
    
    替换为
    
    ```txt
    e.hasActivated="true"=="true"
    ```

3. 至此破解完成，虽然会有“未破解”的提示或弹框，但已经不影响使用。
