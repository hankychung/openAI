# FlyeleNx

## Nx 文档

Visit the [Nx Documentation](https://nx.dev) to learn more.

## 开发流程

命令启动：`yarn serve`

## 创建新应用

`yarn nx g @nrwl/react:app your-app`

## 创建 ui 库

`yarn nx g @nrwl/react:lib your-ui-project`

## 在指定 ui 库中创建组件

```
yarn nx g @nrwl/react:component banner --project=your-ui-project --export
```

## 创建工具类库

`yarn nx g @nrwl/js:lib utils --publishable --importPath @nx-project/utils`

## build

```
yarn nx build web
```

## 打包单独的模块

```
npx nx build your-module
```

## 注意事项

- 引用的所有图标/图片，都用 svg 文件，并且以 ReactComponent 形式引入(https://www.notion.so/33682717e14847fcb6ffed8ebf4bb89c?pvs=4)

  ```
  import { ReactComponent as TargetIcon } from "./assets/targetIcon.svg";
  ```

- 样式中使用的背景图需要上 cdn，否则该 lib 独立打包将会把图片转化为 base64

- fx-nx 中的 icon 统一通过 libs/icon 导出，需要新增 icon 前，先跑 icon-display 项目查看 icon 库中是否已经存在, 新增 icon 规范见 NOTION https://www.notion.so/33682717e14847fcb6ffed8ebf4bb89c?pvs=4 `svg 使用规范`
