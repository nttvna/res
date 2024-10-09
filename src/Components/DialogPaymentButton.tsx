import {FC, useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  showDialog: boolean;
  toggleDialog: (showDialog: boolean) => void;
}

const DialogPaymentButton: FC<Props> = ({showDialog, toggleDialog}) => {
  const renderHeaderDialog = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e5e5',
          paddingBottom: 10,
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <View style={{flexGrow: 1}}>
          <Text style={{fontWeight: 'bold', fontSize: 16, color: '#000'}}>
            Select Payment Type
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => toggleDialog(false)}>
            <Icon name={'close-outline'} style={{color: 'red', fontSize: 30}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (showDialog) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          toggleDialog(!showDialog);
        }}>
        <View style={s.centeredView}>
          <View style={s.modalView}>
            {renderHeaderDialog()}
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, padding: 5, paddingLeft: 0}}>
                <TouchableOpacity>
                  <View style={[s.btnPayment, {backgroundColor: 'green'}]}>
                    <Icon name={'cash-outline'} style={s.iconPayment} />
                    <Text style={s.txtPayment}>CASH</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, padding: 5}}>
                <TouchableOpacity>
                  <View style={[s.btnPayment, {backgroundColor: '#06b6d4'}]}>
                    <Icon name={'receipt-outline'} style={s.iconPayment} />
                    <Text style={s.txtPayment}>CHECK</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, padding: 5}}>
                <TouchableOpacity>
                  <View style={[s.btnPayment, {backgroundColor: '#9333ea'}]}>
                    <Icon name={'gift-outline'} style={s.iconPayment} />
                    <Text style={s.txtPayment}>GIFT CARD</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, padding: 5, paddingRight: 0}}>
                <TouchableOpacity>
                  <View style={[s.btnPayment, {backgroundColor: '#f60'}]}>
                    <Icon name={'card-outline'} style={s.iconPayment} />
                    <Text style={s.txtPayment}>CHARGE CARD</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};
export default DialogPaymentButton;

const s = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '60%',
  },
  btnPayment: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
  },
  iconPayment: {fontSize: 35, marginBottom: 5, color: '#fff'},
  txtPayment: {color: '#fff', fontSize: 13},
});
