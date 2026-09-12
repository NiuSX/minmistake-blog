# 项目非笔记文件作用分析

本文档只分析个人笔记正文以外的项目文件。笔记正文主要位于 `_posts/` 以及 `_posts/Markdown笔记/` 下，图片素材主要位于 `imgs/` 和部分笔记子目录下，这些内容属于博客文章资料，不作为站点框架代码展开分析。

## 1. 项目整体运行逻辑

这个项目是一个基于 Jekyll 和 Minimal Mistakes 主题的静态博客。

运行链路如下：

1. 你在 `_posts/`、`_pages/`、`index.html` 中编写页面内容。
2. Jekyll 读取 `_config.yml`、`_data/`、`_layouts/`、`_includes/` 和 `_sass/`。
3. Liquid 模板把页面、文章、导航、作者信息、归档、搜索等组合成 HTML。
4. Sass 被编译为 `assets/css/main.css`。
5. GitHub Actions 执行构建，把 `_site/` 推送到发布分支或同步到 `NiuSX.github.io/blog/`。
6. GitHub Pages 从 `NiuSX/NiuSX.github.io` 仓库的 `main` 分支发布静态网站，博客内容位于 `blog/` 目录。

## 2. 根目录文件

| 文件 | 作用 |
| --- | --- |
| `.editorconfig` | 统一编辑器缩进、换行、编码等基础格式，避免不同编辑器产生无意义 diff。 |
| `.gitattributes` | 控制 Git 对文本、图片、二进制文件的处理方式，尤其是换行和语言统计。 |
| `.gitignore` | 忽略 `_site/`、缓存、IDE 配置、依赖目录等不应提交的本地生成文件。 |
| `Gemfile` | Ruby 依赖入口，声明 Jekyll、Minimal Mistakes 主题和插件依赖。已添加中文注释。 |
| `Gemfile.lock` | Bundler 锁定依赖版本，保证本地和 GitHub Actions 构建使用一致的 gem 版本。通常不手动编辑。 |
| `_config.yml` | Jekyll 全局配置核心文件，定义主题、站点名称、作者信息、评论、搜索、分页、插件、默认文章配置等。 |
| `index.html` | 首页入口。当前已改造成“个人主页博客”结构，包含个人介绍、关注方向、最新文章。已添加中文注释。 |
| `README.md` | 项目说明文档，记录本地预览、构建和 GitHub Pages 部署方式。 |
| `LICENSE` | 项目许可证文件。 |
| `PROJECT_STRUCTURE_ANALYSIS.md` | 当前分析文档。 |

## 3. GitHub Actions 部署配置

| 文件 | 作用 |
| --- | --- |
| `.github/workflows/pages.yml` | 自动部署工作流。推送 `master` 后安装 Ruby 依赖、使用 `/blog` 作为 `baseurl` 执行 Jekyll 构建，并通过 `BLOG_DEPLOY_TOKEN` 把 `_site/` 同步到 `NiuSX.github.io` 仓库的 `blog/` 目录。已添加中文注释。 |

关键点：

- 当前项目使用 `/blog` 作为站点子路径，目标访问地址为 `https://NiuSX.github.io/blog/`。
- 源码保留在 `master` 分支。
- 发布产物会被工作流写入 `NiuSX.github.io/main` 的 `blog/` 目录。
- 需要在源码仓库配置 `BLOG_DEPLOY_TOKEN`，并授予它写入 `NiuSX/NiuSX.github.io` 仓库内容的权限。

## 4. Jekyll 数据文件

| 路径 | 作用 |
| --- | --- |
| `_data/navigation.yml` | 顶部导航菜单配置。Minimal Mistakes 读取 `main` 列表生成“首页 / 关于 / 归档”。已添加中文注释。 |
| `_data/ui-text.yml` | Minimal Mistakes 的多语言 UI 文案库，例如按钮、搜索、分页、日期、分类标签等显示文本。文件较大，通常不需要频繁修改。 |

## 5. 页面文件

| 路径 | 作用 |
| --- | --- |
| `_pages/about.md` | “关于”页面正文，适合放个人介绍、联系方式、项目经历。已添加中文注释。 |
| `_pages/year-archive.md` | 文章归档页面，使用 `posts` 布局自动展示文章列表。已添加中文注释。 |

这些页面通过 `_config.yml` 的 `include: - _pages` 被纳入构建。

## 6. 布局文件 `_layouts/`

`_layouts/` 是 Jekyll 的页面骨架目录。文章或页面 front matter 中的 `layout` 字段会决定使用哪个布局。

| 文件 | 作用 |
| --- | --- |
| `default.html` | 最底层 HTML 框架，负责输出 `html/head/body`、顶部导航、主体内容、页脚和脚本。 |
| `single.html` | 单篇文章/普通页面布局，包含标题、元信息、正文、目录、评论、上一篇/下一篇等。 |
| `home.html` | 默认博客首页布局，会自动列出最近文章。当前首页已改用自定义 `layout: default`。 |
| `archive.html` | 归档类页面基础布局，用于分类、标签、集合等列表页。 |
| `posts.html` | 文章归档布局，用于 `_pages/year-archive.md`。 |
| `categories.html` / `category.html` | 分类列表和单分类页面布局。 |
| `tags.html` / `tag.html` | 标签列表和单标签页面布局。 |
| `collection.html` | Jekyll collection 集合页布局。 |
| `search.html` | 搜索页面布局。 |
| `splash.html` | 适合做专题页或视觉型落地页的布局。 |
| `compress.html` | HTML 压缩布局，减少生成页面体积。 |
| `archive-taxonomy.html` | 分类/标签归档的细分布局。 |

这些文件主要来自 Minimal Mistakes 主题。除非要深入定制主题结构，否则建议少改。

## 7. 组件文件 `_includes/`

`_includes/` 是可复用模板片段目录，布局文件会通过 `{% include %}` 或 `{% include_cached %}` 引入它们。

主要类别：

| 类别 | 代表文件 | 作用 |
| --- | --- | --- |
| 页面头部 | `head.html`、`head/custom.html`、`seo.html`、`schema.html` | 输出 meta、SEO、结构化数据、CSS 引入等。 |
| 导航与页眉 | `masthead.html`、`nav_list`、`breadcrumbs.html`、`skip-links.html` | 顶部导航、面包屑、辅助访问跳转。 |
| 作者与侧边栏 | `author-profile.html`、`author-profile-custom-links.html`、`sidebar.html`、`sidebar-custom.html` | 作者头像、简介、社交链接、侧边栏。 |
| 文章展示 | `archive-single.html`、`documents-collection.html`、`page__meta.html`、`page__taxonomy.html`、`page__date.html` | 文章卡片、日期、分类、标签、阅读信息。 |
| 翻页与归档 | `paginator.html`、`paginator-v1.html`、`paginator-v2.html`、`post_pagination.html` | 首页分页、归档分页、文章上一篇/下一篇。 |
| 评论系统 | `comments.html`、`comment.html`、`comments-providers/*` | Disqus、Giscus、Utterances、Facebook 等评论接入模板。 |
| 搜索系统 | `search/search_form.html`、`search/lunr-search-scripts.html`、`search/algolia-search-scripts.html`、`search/google-search-scripts.html` | 搜索框和不同搜索服务的脚本引入。 |
| 多媒体与内容块 | `figure`、`gallery`、`video`、`feature_row`、`toc.html`、`toc` | 图片、画廊、视频、功能行、文章目录。 |
| 页脚与脚本 | `footer.html`、`footer/custom.html`、`scripts.html`、`after-content.html`、`before-related.html` | 页脚链接、脚本加载、内容前后扩展点。 |
| 统计分析 | `analytics.html`、`analytics-providers/*` | Google Analytics、Swetrix 或自定义统计脚本。 |

这些文件大多是主题内部组件。理解它们的方式是从 `_layouts/default.html` 和 `_layouts/single.html` 开始，看它们引入了哪些 include。

## 8. 样式文件

| 路径 | 作用 |
| --- | --- |
| `assets/css/main.scss` | Sass 编译入口。先导入主题皮肤，再导入主题主体样式，最后导入项目自定义首页样式和 `_sass/_blog-overrides.scss`，用于统一博客阅读样式。已添加中文注释。 |
| `_sass/_home-profile.scss` | 当前项目自定义首页样式，控制首页首屏、个人信息卡片、近期关注、最新文章列表和响应式布局。已添加中文注释。 |
| `_sass/minimal-mistakes.scss` | Minimal Mistakes 主题 Sass 主入口。 |
| `_sass/minimal-mistakes/*.scss` | 主题基础样式模块，例如正文、按钮、表格、导航、页脚、搜索、侧边栏、语法高亮等。 |
| `_sass/minimal-mistakes/skins/*.scss` | 主题皮肤变量，`_config.yml` 的 `minimal_mistakes_skin: "air"` 会选择 `_air.scss`。 |
| `_sass/minimal-mistakes/vendor/*` | 主题内置第三方 Sass 工具库，例如 breakpoint、susy、magnific-popup。 |

维护建议：

- 优先修改 `_sass/_home-profile.scss` 这类项目自定义文件。
- 不建议直接大面积修改 `_sass/minimal-mistakes/`，否则以后升级主题时很难合并。

## 9. JavaScript 文件

| 路径 | 作用 |
| --- | --- |
| `assets/js/_main.js` | Minimal Mistakes 的主题交互源码，负责搜索开关、作者链接展开、平滑滚动、视频适配等。已添加中文说明。 |
| `assets/js/main.min.js` | 压缩后的主题 JS，浏览器实际加载的可能是这个文件。通常由主题构建流程生成，不建议手改。 |
| `assets/js/main.min.js.map` | JS sourcemap，方便调试压缩文件对应源码。 |
| `assets/js/lunr/*` | Lunr 本地搜索相关脚本和索引数据逻辑。 |
| `assets/js/plugins/*` | 第三方前端插件，例如 smooth-scroll、fitvids、magnific-popup 等。 |
| `assets/js/vendor/jquery/jquery-3.6.0.js` | jQuery 第三方库。 |

维护建议：

- 第三方插件和压缩产物不建议逐行加中文注释，因为它们不是项目业务代码。
- 若后续要写自己的交互，建议新增 `assets/js/custom.js`，再通过 `_includes/scripts.html` 或 `_includes/footer/custom.html` 引入。

## 10. 资源文件

| 路径 | 作用 |
| --- | --- |
| `assets/images/wukong-photo.jpg` | 当前作者头像，`_config.yml` 和首页个人卡片都会引用它。 |
| `assets/images/catppuccin_*.png` | Minimal Mistakes 主题皮肤示例图或主题资源。 |
| `imgs/` | 文章中使用的图片资料，属于笔记内容资产。 |

## 11. 配置文件 `_config.yml` 的关键职责

`_config.yml` 是整个项目最重要的配置文件，主要控制：

- 主题：`theme: "minimal-mistakes-jekyll"`
- 皮肤：`minimal_mistakes_skin: "air"`
- 站点信息：`title`、`description`、`url`、`baseurl`
- 作者信息：`author.name`、`author.avatar`、`author.bio`、社交链接
- 导航和页面包含：`include: - _pages`
- 插件：`jekyll-paginate`、`jekyll-sitemap`、`jekyll-feed`、`jekyll-include-cache`
- 文章默认设置：布局、作者栏、目录、相关文章、评论等
- 搜索、统计、评论、分页、归档路径等功能开关

理解这个项目时，可以把 `_config.yml` 看成“站点总控制台”。

## 12. 已添加中文注释的文件

本次已对这些项目自有或关键入口文件添加中文注释：

- `index.html`
- `_sass/_home-profile.scss`
- `assets/css/main.scss`
- `.github/workflows/pages.yml`
- `Gemfile`
- `_data/navigation.yml`
- `_pages/about.md`
- `_pages/year-archive.md`
- `assets/js/_main.js`

没有逐行注释的文件主要是以下几类：

- `_posts/` 下的笔记正文和笔记图片：这是你的内容资料，不属于站点框架代码。
- `_sass/minimal-mistakes/`、`_includes/`、`_layouts/` 的大部分主题源码：来自 Minimal Mistakes，直接大面积改动会增加升级成本。
- `assets/js/plugins/`、`assets/js/vendor/`、`assets/js/lunr/`、`assets/js/main.min.js`：第三方库、搜索库或压缩产物，手动注释意义低且容易破坏更新路径。

## 13. 推荐阅读顺序

如果你想理解这个项目，建议按这个顺序看：

1. `README.md`：先知道怎么运行和部署。
2. `_config.yml`：理解站点全局配置。
3. `index.html`：理解首页是怎么写的。
4. `_sass/_home-profile.scss`：理解首页样式怎么控制。
5. `_data/navigation.yml`：理解顶部菜单怎么生成。
6. `_pages/about.md` 和 `_pages/year-archive.md`：理解普通页面怎么写。
7. `_layouts/default.html`：理解整站 HTML 骨架。
8. `_layouts/single.html`：理解文章页结构。
9. `_includes/author-profile.html`、`_includes/masthead.html`、`_includes/footer.html`：理解作者栏、导航栏和页脚。
10. `.github/workflows/pages.yml`：理解自动部署流程。

## 14. 后续维护建议

- 新文章放在 `_posts/YYYY-MM-DD-title.md`。
- 新页面放在 `_pages/`，并在 `_data/navigation.yml` 中添加导航。
- 首页视觉继续改 `_sass/_home-profile.scss`。
- 站点标题、作者信息、头像、社交链接优先改 `_config.yml`。
- 不要手动编辑 `_site/`，它是构建产物。
- 不要把业务改动写进第三方插件或压缩 JS，后续升级和排查会更困难。

文章写作约定统一记录在 docs/POST_TEMPLATE.md，新增文章应只修改 _posts/ 下的 Markdown 文件。
