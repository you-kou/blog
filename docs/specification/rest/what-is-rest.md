# 什么是 REST？

> [!IMPORTANT]
>
> 原文：[Learn REST API Design](https://www.restapitutorial.com/)

“RESTful API”或“RESTful 服务”是一个热门话题。那么，什么是REST？我们如何创建一个所谓的RESTful API呢？好问题！让我们来谈谈这个常常被误解的术语……

## 定义REST

从技术角度来说，REST 是“表述性状态转移”（REpresentational State Transfer）的缩写，这是一种最初由 Roy Fielding 在他的博士论文中提出的架构风格（详见 [Representational State Transfer (REST)](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)）。你可以在这里阅读更多关于这六个约束的详细信息，但首先我想简要概述一下人们在谈论“REST”时的意思。

需要明确的是，Roy Fielding 论文中的约束必须得到满足，才能使服务在技术上符合 RESTful 标准。而且，REST 约束并没有指定通信协议。然而，当前这个术语的使用非常宽泛，在今天的互联网环境下，“RESTful”几乎总是指基于 HTTP 的 API。这意味着它在 HTTP 上以请求-响应的方式操作，通常使用 JSON 作为请求和响应体中的数据格式。尽管有很多细节，但实际上就是这么简单！

换句话说，调用者（或客户端）：

- 向一个 URL 发起 HTTP 请求…
  - 使用标准的 HTTP 方法之一（如 GET、PUT、POST、PATCH、DELETE 等）…
  - 请求体中通常包含一些内容（通常是 JSON）…
- 然后等待响应，响应通常：
  - 通过 HTTP 响应码指示状态
  - 响应体中通常包含更多的 JSON 数据。

## 示例

例如，假设我们想要在 iTunes 上搜索 RadioHead 的歌曲。我们将调用 iTunes 搜索 API（请参见：https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html）。

我们可以在命令行中使用 `curl`，如下所示。在这种情况下，URL 上的所有查询字符串参数仅仅是在告诉搜索 API 要搜索的关键词（radiohead）、我们希望返回的结果数量（3），以及媒体类型（music）：

```sh
curl -i 'https://itunes.apple.com/search?term=radiohead&media=music&limit=3'
```

这将返回以下 JSON 响应：

```json
{
   "resultCount":3,
   "results":[
      {
         "wrapperType":"track",
         "kind":"song",
         "artistId":657515,
         "collectionId":1109714933,
         "trackId":1109715066,
         "artistName":"Radiohead",
         "collectionName":"In Rainbows",
         "trackName":"15 Step",
         "collectionCensoredName":"In Rainbows",
         "trackCensoredName":"15 Step",
         "artistViewUrl":"https://music.apple.com/us/artist/radiohead/657515?uo=4",
         "collectionViewUrl":"https://music.apple.com/us/album/15-step/1109714933?i=1109715066&uo=4",
         "trackViewUrl":"https://music.apple.com/us/album/15-step/1109714933?i=1109715066&uo=4",
         "previewUrl":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/af/72/85/af728523-8048-4a8b-9e13-e8f4f64e9d69/mzaf_8205306206851675436.plus.aac.p.m4a",
         "artworkUrl30":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/30x30bb.jpg",
         "artworkUrl60":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/60x60bb.jpg",
         "artworkUrl100":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/100x100bb.jpg",
         "collectionPrice":9.99,
         "trackPrice":1.29,
         "releaseDate":"2007-10-10T07:00:00Z",
         "collectionExplicitness":"notExplicit",
         "trackExplicitness":"notExplicit",
         "discCount":1,
         "discNumber":1,
         "trackCount":10,
         "trackNumber":1,
         "trackTimeMillis":237293,
         "country":"USA",
         "currency":"USD",
         "primaryGenreName":"Alternative",
         "isStreamable":true
      },
      {
         "wrapperType":"track",
         "kind":"song",
         "artistId":657515,
         "collectionId":1109714933,
         "trackId":1109715161,
         "artistName":"Radiohead",
         "collectionName":"In Rainbows",
         "trackName":"Bodysnatchers",
         "collectionCensoredName":"In Rainbows",
         "trackCensoredName":"Bodysnatchers",
         "artistViewUrl":"https://music.apple.com/us/artist/radiohead/657515?uo=4",
         "collectionViewUrl":"https://music.apple.com/us/album/bodysnatchers/1109714933?i=1109715161&uo=4",
         "trackViewUrl":"https://music.apple.com/us/album/bodysnatchers/1109714933?i=1109715161&uo=4",
         "previewUrl":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ba/e4/ac/bae4ac59-3bfa-e4b9-4f4c-03f667324fc0/mzaf_14837742185575446625.plus.aac.p.m4a",
         "artworkUrl30":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/30x30bb.jpg",
         "artworkUrl60":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/60x60bb.jpg",
         "artworkUrl100":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/100x100bb.jpg",
         "collectionPrice":9.99,
         "trackPrice":1.29,
         "releaseDate":"2007-10-10T07:00:00Z",
         "collectionExplicitness":"notExplicit",
         "trackExplicitness":"notExplicit",
         "discCount":1,
         "discNumber":1,
         "trackCount":10,
         "trackNumber":2,
         "trackTimeMillis":242293,
         "country":"USA",
         "currency":"USD",
         "primaryGenreName":"Alternative",
         "isStreamable":true
      },
      {
         "wrapperType":"track",
         "kind":"song",
         "artistId":657515,
         "collectionId":1109714933,
         "trackId":1109715168,
         "artistName":"Radiohead",
         "collectionName":"In Rainbows",
         "trackName":"Weird Fishes / Arpeggi",
         "collectionCensoredName":"In Rainbows",
         "trackCensoredName":"Weird Fishes / Arpeggi",
         "artistViewUrl":"https://music.apple.com/us/artist/radiohead/657515?uo=4",
         "collectionViewUrl":"https://music.apple.com/us/album/weird-fishes-arpeggi/1109714933?i=1109715168&uo=4",
         "trackViewUrl":"https://music.apple.com/us/album/weird-fishes-arpeggi/1109714933?i=1109715168&uo=4",
         "previewUrl":"https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/6c/e9/79/6ce9792e-c06a-b49b-6efe-60b96a690af8/mzaf_5478326228427438939.plus.aac.p.m4a",
         "artworkUrl30":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/30x30bb.jpg",
         "artworkUrl60":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/60x60bb.jpg",
         "artworkUrl100":"https://is2-ssl.mzstatic.com/image/thumb/Music115/v4/9a/4f/8a/9a4f8a4b-0254-d5ab-74b5-ebe39bbbe85d/634904032463.png/100x100bb.jpg",
         "collectionPrice":9.99,
         "trackPrice":1.29,
         "releaseDate":"2007-10-10T07:00:00Z",
         "collectionExplicitness":"notExplicit",
         "trackExplicitness":"notExplicit",
         "discCount":1,
         "discNumber":1,
         "trackCount":10,
         "trackNumber":4,
         "trackTimeMillis":318187,
         "country":"USA",
         "currency":"USD",
         "primaryGenreName":"Alternative",
         "isStreamable":true
      }
   ]
}
```

