const catalog = 'language';

export default [
    {
        text: 'Java',
        items: [
            {
                text: 'API',
                items: [
                    {
                        text: 'java.nio.file',
                        items: [
                            { text: 'CopyOption', link: `/${catalog}/java/api/java.nio.file/CopyOption` },
                            { text: 'Files', link: `/${catalog}/java/api/java.nio.file/Files` },
                            { text: 'Path', link: `/${catalog}/java/api/java.nio.file/Path` },
                            { text: 'Paths', link: `/${catalog}/java/api/java.nio.file/Paths` },
                            { text: 'StandardCopyOption', link: `/${catalog}/java/api/java.nio.file/StandardCopyOption` },
                        ]
                    }
                ]
            }
        ]
    }
]