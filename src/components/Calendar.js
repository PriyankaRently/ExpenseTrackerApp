import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarView = ({ onDateSelect }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayText, setDisplayText] = useState("Selection will appear here");
  const [showCalendar, setShowCalendar] = useState(false);
  const onDayPress = (day) => {
    const date = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setMarkedDates({
        [date]: { selected: true, color: "#32CD32", textColor: "#FFFFFF" },
      });
    } else if (startDate && !endDate) {
      setEndDate(date);
      const start = new Date(startDate);
      const end = new Date(date);
      const newMarkedDates = {};

      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        newMarkedDates[dateStr] = {
          selected: true,
          color: "#32CD32",
          textColor: "#FFFFFF",
        };
      }
      setMarkedDates(newMarkedDates);
    }
  };

  const handleOkPress = () => {
    if (startDate && endDate) {
      setDisplayText(`From ${startDate} to ${endDate}`);
      onDateSelect(startDate, endDate);
    }
    setShowCalendar(false);
  };

  return (
    <View>
      {!showCalendar && (
      <Button
        title="Select Date Range"
        onPress={() => setShowCalendar(true)}
        color="#32CD32"
      />
        )}

      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: "#000000",
          calendarBackground: "#000000",
          textSectionTitleColor: "#32CD32",
          textMonthFontWeight: "bold",
          todayTextColor: "#32CD32",
          dayTextColor: "#FFFFFF",
          selectedDayBackgroundColor: "#32CD32",
          selectedDayTextColor: "#FFFFFF",
          arrowColor: "#32CD32",
          monthTextColor: "#32CD32",
        }}
      />
      <Button title="OK" onPress={handleOkPress} color="#32CD32" />
      <TextInput
        style={styles.input}
        placeholder="Selection will appear here"
        placeholderTextColor="#32CD32"
        value={displayText}
        editable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#32CD32",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: "#32CD32",
    marginTop: 20,
  },
});

export default CalendarView;
