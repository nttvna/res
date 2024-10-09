import {Text, View, Image, TouchableOpacity} from 'react-native';
import {categoryObjView} from '../../Models/order';
import {FC} from 'react';
import ImageWithFallback from '../../Components/ImageWithFallback';

interface Props {
  data: categoryObjView;
  selectCategory: () => void;
}

const CategoryItem: FC<Props> = ({data, selectCategory}) => {
  return (
    <TouchableOpacity
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
      }}
      onPress={selectCategory}>
      <View>
        <ImageWithFallback path={data.CategoryImage} aspectRatio={4 / 3} />
      </View>
      <View style={{paddingTop: 2, paddingBottom: 8}}>
        <Text style={{color: '#333', textAlign: 'center'}}>
          {data.CategoryName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default CategoryItem;
