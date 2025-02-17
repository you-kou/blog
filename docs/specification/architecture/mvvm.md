# MVVM 框架

**MVVM（Model-View-ViewModel）** 是一种**前端架构模式**，主要用于**分离 UI 界面（View）和业务逻辑（Model）**，提高代码的可维护性和复用性。

MVVM 框架指的是**基于 MVVM 设计模式的前端框架**，比如 Vue.js、Angular 和部分 React 方案，它们通过**双向数据绑定**和**视图更新机制**，减少了手动操作 DOM 的复杂性。

## MVVM 的三大核心部分

### Model（模型，数据层）

- 负责**存储和管理数据**，通常指的是 JavaScript 对象、状态管理库（如 Vuex / Pinia / Redux）。

- Model 变化后，ViewModel 会自动更新 View。

### View（视图，用户界面层）

- 负责**展示 UI 界面**，通常是 HTML + CSS。

- 通过数据绑定（如 Vue 的 `{{ message }}`）与 Model 关联，**数据变化会自动更新视图**。

### ViewModel（视图模型，逻辑层）

连接 **Model 和 View**，监听 Model 变化，并自动更新 View。

处理用户交互，如按钮点击、输入框输入等。

## MVVM 工作流程

1. **Model（数据）发生变化** → **ViewModel 监听到变化** → **自动更新 View（页面 UI）**。

2. **用户操作 View（点击按钮、输入内容）** → **ViewModel 处理逻辑** → **更新 Model（数据）**。

3. **ViewModel 充当中间层，负责数据和视图的同步**，避免手动操作 DOM。

## MVVM 与传统 MVC 的区别

| **对比项**     | **MVVM**                     | **MVC**                                                      |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| **数据绑定**   | **双向绑定**（View ↔ Model） | **单向绑定**（View ← Model）                                 |
| **开发方式**   | 直接操作数据，视图自动更新   | 需要手动更新视图（如 `document.getElementById().innerText`） |
| **适用框架**   | Vue、Angular                 | 早期的前端框架（如 Backbone.js）                             |
| **代码复杂度** | **更简洁**，减少手动操作 DOM | **较复杂**，需要手动 DOM 操作                                |