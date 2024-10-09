import React, {FC, useState} from 'react';
import {Image, View} from 'react-native';
import {baseUrl} from '../const';

interface Props {
  path: string;
  aspectRatio: number;
}

const ImageWithFallback: FC<Props> = ({path, aspectRatio}) => {
  const [imageSource, setImageSource] = useState({uri: `${baseUrl}${path}`});

  if (path) {
    return (
      <View style={{aspectRatio}}>
        <Image
          source={imageSource}
          onError={() => setImageSource(require('../Assets/no-image.png'))}
          style={{width: '100%', height: '100%', backgroundColor: '#f8f8f8'}}
          resizeMode="cover"
        />
      </View>
    );
  } else {
    return (
      <View style={{aspectRatio}}>
        <Image
          source={require('../Assets/no-image.png')}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />
      </View>
    );
  }
};

export default React.memo(ImageWithFallback);
