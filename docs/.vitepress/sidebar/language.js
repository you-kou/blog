const catalog = 'language';

export default [
    {
        text: 'Java',
        link: `/${catalog}/java/`,
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
                    },
                    {
                        text: 'jakarta.persistence',
                        items: [
                            { text: 'Column', link: `/${catalog}/java/api/jakarta.persistence/Column` },
                            { text: 'Entity', link: `/${catalog}/java/api/jakarta.persistence/Entity` },
                            { text: 'GeneratedValue', link: `/${catalog}/java/api/jakarta.persistence/GeneratedValue` },
                            { text: 'GenerationType', link: `/${catalog}/java/api/jakarta.persistence/GenerationType` },
                            { text: 'Id', link: `/${catalog}/java/api/jakarta.persistence/Id` },
                            { text: 'Table', link: `/${catalog}/java/api/jakarta.persistence/Table` },
                        ]
                    },
                ]
            }
        ]
    }
]