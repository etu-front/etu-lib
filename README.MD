# ETU-LIB

![build](https://travis-ci.org/etu-front/etu-lib.svg?branch=master) ![](https://img.shields.io/badge/framework-react-blue.svg)

## Dependencies

- react
- antd
- styled-components
- react-lazyload
- prop-types

## Include

- View

- FileIcon

  ![2018-11-23 17 54 15](https://user-images.githubusercontent.com/5368890/48937373-d4b33c00-ef48-11e8-8a46-63f12f07939d.png)

  Usage
  ```
    import { FileIcon } from '@etu/lib'

    <FileIcon type={'pdf'} size={64} />
  ```
- MediaList

  + 普通视图

  ![2018-11-23 17 32 21](https://user-images.githubusercontent.com/5368890/48936436-eba45f00-ef45-11e8-8073-0c48d21cd15c.png)

  + 全铺视图

   ![2018-11-23 17 31 46](https://user-images.githubusercontent.com/5368890/48936484-0a0a5a80-ef46-11e8-8c18-bc52d0873376.png)

  + 带文件名视图

  ![2018-11-23 17 30 27](https://user-images.githubusercontent.com/5368890/48936438-ec3cf580-ef45-11e8-8d92-c4d8206ed520.png)

- SlideShow
 ![2018-11-23 17 49 20](https://user-images.githubusercontent.com/5368890/48937139-260efb80-ef48-11e8-93ad-7a76698428e1.png)


## Usage
  ```jsx
  import { MediaList, SlideShow } from '@etu/lib'
  import APIS from 'conf/apis'

  const getFile = id => APIS.getFile.id(id)
  const getDownload = id => APIS.getDownload.id(id)
  const getThumbnail = (id, width, height) => APIS.SIZE_THUMBNAIL.id(id).width(width).height(height)

  // 需重载这几个静态方法
  MediaList.bindGetFileFunctions({ getThumbnail, getFile, getDownload })
  SlideShow.bindGetFileFunctions({ getThumbnail, getFile, getDownload })

  const items = [
    {
      "type": "pdf",
      "media_id": "E77SKH7F7HXQ06YNZAF64GFC76Q9SEZA",
      "id": "E77SKH7F7HXQ06YNZAF64GFC76Q9SEZA",
      "name": "LastOfUs2.pdf"
    },
    {
      "data": "YM0JXBCAA84DJ7WEZ20TY5D4HZV3DHW3",
      "id": 381,
      "name": "【中文版】ETU PBL Backwards Design Template.docx",
      "type": "word"
    },
    {
      "media_id": "67BD020K2E6JMGX9R00NZ8DQ8KBSSWPG",
      "type": "picture",
      "name": "1530871462174.jpg",
      "extra": {
        ...
        "attrs": {
          ...
          "file_name": "1530871462174.jpg"
        }
      }
    }
  ]

  const App = connect(state => ({ slideshow: state.slideshow }))(({ slideshow }) => {
    return (
      <View height={400} align={'center'} justify={'center'}>
        <MediaList
          items={items}
          background={'transparent'}
          fixed noName
          onClick={(items, current) => console.log}
          hasDeleteButton={false}
          onDelete={id => console.log(id)}
          width={160}
          height={120}
        />
        <SlideShow
          canDownload
          sidebar={true}
          onClose={() => dispatch({ type: 'slideshow/HIDE' })}
          visible={slideshow.visible}
          medias={slideshow.items}
          current={slideshow.current}
        />
      </View>
    )
  })
  ReactDom.render(<App />, document.getElementById('root'))
  ```
