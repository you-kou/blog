const catalog = 'specification';

export default [
    {
        text: '最佳实践',
        items: [
            { text: '规范一览', link: '/framework/summary' }
        ]
    },
    {
        text: '数据格式',
        collapsed: true,
        items: [
            { text: 'csv', link: '/specification/data-format/csv' },
            { text: 'JSON', link: '/specification/data-format/json' },
            { text: 'XML', link: '/specification/data-format/xml' },
            { text: 'Properties', link: '/specification/data-format/properties' },
            { text: 'YAML', link: '/specification/data-format/yaml' },
        ]
    },
    {
        text: '系统架构',
        collapsed: true,
        items: [
            { text: '前后端分离架构', link: '/specification/architecture/frontend-backend-separation' },
            { text: 'MVVM 框架', link: '/specification/architecture/mvvm' },
            { text: '领域驱动设计（DDD）', link: '/specification/architecture/ddd' },
        ]
    },
    {
        text: 'REST',
        collapsed: true,
        items: [
            { text: '什么是 REST?', link: '/specification/rest/what-is-rest' },
            { text: '六个约束条件', link: '/specification/rest/the-six-constraints' },
            { text: 'REST 快速提示', link: '/specification/rest/rest-quick-tips' },
            { text: 'HTTP 方法', link: '/specification/rest/http-methods' },
            { text: '资源命名', link: '/specification/rest/resource-naming' },
            { text: '幂等性', link: '/specification/rest/idempotence' },
            { text: '安全性', link: '/specification/rest/safety' },
        ]
    },
    {
        text: '设计模式',
        collapsed: true,
        items: [
            { text: '设计模式概述', link: '/specification/design-patterns/overview-of-design-patterns' },
            { text: 'UML图', link: '/specification/design-patterns/uml-diagram' },
            { text: '软件设计原则', link: '/specification/design-patterns/software-design-principles' },
            {
                text: '创建者模式',
                link: '/specification/design-patterns/creational-pattern',
                items: [
                    { text: '单例设计模式', link: '/specification/design-patterns/creational-patterns/singleton' },
                    { text: '工厂模式', link: '/specification/design-patterns/creational-patterns/factory' },
                    { text: '抽象工厂模式', link: '/specification/design-patterns/creational-patterns/abstract-factory' },
                    { text: '原型模式', link: '/specification/design-patterns/creational-patterns/prototype' },
                    { text: '建造者模式', link: '/specification/design-patterns/creational-patterns/builder' },
                    { text: '创建者模式对比', link: '/specification/design-patterns/creational-patterns/comparison-of-creational-patterns' },
                ]
            },
            {
                text: '结构型模式',
                link: '/specification/design-patterns/structural-patterns',
                items: [
                    { text: '代理模式', link: '/specification/design-patterns/structural-patterns/proxy' },
                    { text: '适配器模式', link: '/specification/design-patterns/structural-patterns/adapter' },
                    { text: '装饰者模式', link: '/specification/design-patterns/structural-patterns/decorator' },
                    { text: '桥接模式', link: '/specification/design-patterns/structural-patterns/bridge' },
                    { text: '外观模式', link: '/specification/design-patterns/structural-patterns/facade' },
                    { text: '组合模式', link: '/specification/design-patterns/structural-patterns/composite' },
                    { text: '享元模式', link: '/specification/design-patterns/structural-patterns/flyweight' },
                ]
            },
            {
                text: '行为型模式',
                link: '/specification/design-patterns/behavioral-patterns/',
                items: [
                    { text: '模板方法模式', link: '/specification/design-patterns/behavioral-patterns/template-method' },
                ]
            }
        ]
    },
    {
        text: '协议',
        collapsed: true,
        items: [
            {
                text: 'HTTP',
                items: [
                    {
                        text: '参考',
                        items: [
                            {
                                text: 'HTTP 标头',
                                items: [
                                    { text: 'Content-Disposition', link: `/${catalog}/protocol/http/reference/headers/Content-Disposition` },
                                    { text: 'Location', link: `/${catalog}/protocol/http/reference/headers/Location` },
                                ]
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        text: 'RFC',
        collapsed: true,
        items: [
            { text: 'RFC 简介', link: '/specification/rfc/rfc' },
            { text: 'URI 模板', link: '/specification/rfc/uri-template' },
        ]
    },
]