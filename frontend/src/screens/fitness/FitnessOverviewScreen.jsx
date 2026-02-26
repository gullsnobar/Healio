import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import StepCounter from '../../components/fitness/StepCounter';
import SleepTracker from '../../components/fitness/SleepTracker';
import WaterIntakeLogger from '../../components/fitness/WaterIntakeLogger';
import GoogleFitSync from '../../components/fitness/GoogleFitSync';
import { fetchFitnessData } from '../../redux/slices/fitnessSlice';

const FitnessOverviewScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dailyData, loading } = useSelector((state) => state.fitness);
  useEffect(() => { dispatch(fetchFitnessData()); }, []);

  const nav = (screen) => () => navigation.navigate(screen);

  return (
    <ScrollView style={s.c}>
      <GoogleFitSync lastSynced={dailyData?.lastSynced} onSync={() => dispatch(fetchFitnessData())} />
      <TouchableOpacity onPress={nav('Steps')}><StepCounter steps={dailyData?.steps || 0} /></TouchableOpacity>
      <TouchableOpacity onPress={nav('Sleep')}><SleepTracker hours={dailyData?.sleep || 0} /></TouchableOpacity>
      <WaterIntakeLogger intake={dailyData?.water || 0} onAdd={() => {}} />
      <View style={s.row}>
        {[['DietLog','Diet Log'],['ManualEntry','Manual Entry']].map(([r,t])=>(
          <TouchableOpacity key={r} style={s.btn} onPress={nav(r)}><Text style={s.btnT}>{t}</Text></TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
const s = StyleSheet.create({c:{flex:1,backgroundColor:'#F5F7FA',padding:16},row:{flexDirection:'row',gap:12,marginTop:16},btn:{flex:1,backgroundColor:'#4A90D9',padding:14,borderRadius:8,alignItems:'center'},btnT:{color:'#FFF',fontWeight:'600'}});
export default FitnessOverviewScreen;
