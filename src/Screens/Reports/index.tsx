import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Layout from '../../Layout';
import { reportRouteParam } from '../../Models/setting';
import { ReportRange, ReportType, info_700 } from '../../const';
import DailyReport from './DailyReport';
import MonthlyReport from './MonthlyReport';
import WeeklyReport from './WeeklyReport';

const Reports = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const [routeParam, setRouteParam] = useState<reportRouteParam>({
        repType: ReportType.Invoice,
        rangeType: ReportRange.Daily,
        random: (route.params && route.params.rand) ? route.params.rand : 0
    })
    const changeType = (val: ReportType) => {
        setRouteParam(prevState => {
            return ({
                ...prevState,
                repType: val
            });
        })
    }


    const changeRange = (val: ReportRange) => {
        setRouteParam(prevState => {
            return ({
                ...prevState,
                rangeType: val
            });
        })
    }

    const renderContent = () => {
        switch (routeParam.rangeType) {
            case ReportRange.Weekly:
                return <WeeklyReport {...routeParam} />
            case ReportRange.Monthly:


            
                return <MonthlyReport {...routeParam} />
            default:
                return <DailyReport {...routeParam} />
        }
    }

    return (
        <Layout screenName="Report">
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon
                            name={'arrow-back-outline'}
                            style={{ color: '#333', fontSize: 25, marginRight: 8 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexGrow: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 18 }}>
                        Sales Report
                    </Text>
                </View>
                <View style={s.viewType}>
                    <TouchableOpacity style={s.btnGroup} onPress={() => changeType(ReportType.Invoice)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.repType == ReportType.Invoice ? "#0e7490" : '#fff'
                            }]}>
                            <Icon
                                name={'receipt-outline'}
                                color={routeParam.repType == ReportType.Invoice ? '#fff' : '#0e7490'}
                                style={{
                                    fontSize: 16,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={{ color: routeParam.repType == ReportType.Invoice ? '#fff' : '#0e7490' }}>INVOICES</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnGroup} onPress={() => changeType(ReportType.Items)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.repType == ReportType.Items ? "#0e7490" : '#fff'
                            }]}>
                            <Icon
                                name={'list-outline'}
                                color={routeParam.repType == ReportType.Items ? '#fff' : '#0e7490'}
                                style={{
                                    fontSize: 15,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={{ color: routeParam.repType == ReportType.Items ? '#fff' : '#0e7490' }}>ITEMS</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnGroup} onPress={() => changeType(ReportType.DailySummary)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.repType == ReportType.DailySummary ? "#0e7490" : '#fff'
                            }]}>
                            <Icon
                                name={'today-outline'}
                                color={routeParam.repType == ReportType.DailySummary ? '#fff' : '#0e7490'}
                                style={{
                                    fontSize: 15,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={{ color: routeParam.repType == ReportType.DailySummary ? '#fff' : '#0e7490' }}>DAILY SUMMARY</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnGroup} onPress={() => changeType(ReportType.DailyDetail)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.repType == ReportType.DailyDetail ? "#0e7490" : '#fff'
                            }]}>
                            <Icon
                                name={'reader-outline'}
                                color={routeParam.repType == ReportType.DailyDetail ? '#fff' : '#0e7490'}
                                style={{
                                    fontSize: 15,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={{ color: routeParam.repType == ReportType.DailyDetail ? '#fff' : '#0e7490' }}>DAILY DETAIL</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={s.viewRange}>
                    <TouchableOpacity style={[s.btnGroupRange, {
                        backgroundColor: routeParam.rangeType == ReportRange.Daily ? "#0e7490" : '#fff'
                    }]} onPress={() => changeRange(ReportRange.Daily)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.rangeType == ReportRange.Daily ? "#0e7490" : '#fff'
                            }]}>
                            <Text style={{ color: routeParam.rangeType == ReportRange.Daily ? '#fff' : '#0e7490' }}>DAY</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btnGroupRange, {
                        backgroundColor: routeParam.rangeType == ReportRange.Weekly ? "#0e7490" : '#fff'
                    }]} onPress={() => changeRange(ReportRange.Weekly)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.rangeType == ReportRange.Weekly ? "#0e7490" : '#fff'
                            }]}>
                            <Text style={{ color: routeParam.rangeType == ReportRange.Weekly ? '#fff' : '#0e7490' }}>WEEK</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btnGroupRange, {
                        backgroundColor: routeParam.rangeType == ReportRange.Monthly ? "#0e7490" : '#fff'
                    }]} onPress={() => changeRange(ReportRange.Monthly)}>
                        <View
                            style={[s.btn, {
                                backgroundColor: routeParam.rangeType == ReportRange.Monthly ? "#0e7490" : '#fff'
                            }]}>
                            <Text style={{ color: routeParam.rangeType == ReportRange.Monthly ? '#fff' : '#0e7490' }}>MONTH</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{
                margin: 12,
                padding: 12,
                marginTop: 0,
                flexGrow: 1,
                borderTopWidth: 2,
                borderTopColor: '#e5e5e5',
                paddingBottom: 130,
                backgroundColor: '#fff'
            }}>
                {renderContent()}
            </View>
        </Layout>
    );
};

export default Reports;

const s = StyleSheet.create({
    viewType: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 600,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        overflow: 'hidden',
    },
    viewRange: {
        marginLeft: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 40,
        width: 240,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        overflow: 'hidden',
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        height: 30,
        borderRightWidth: 0.25,
        borderLeftWidth: 0.25,
        borderColor: '#6B7280'
    },
    btnGroup: {
        flex: 1 / 4
    },
    btnGroupRange: {
        flex: 1 / 3
    },
    header: {
        fontWeight: 'bold', color: info_700,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemcenter: {
        alignItems: 'center',
        color: '#333'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '50%',
    },
    row: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
    },
    rowLeft: {
        width: 150,
    },
    rowRight: {
        flexGrow: 1,
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 5,
        color: '#000',
        paddingLeft: 10
    }
});
