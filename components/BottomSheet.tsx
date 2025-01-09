import React, { useRef, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface HintBottomSheetProps {
  children: React.ReactNode;
}

const HintBottomSheet: React.FC<HintBottomSheetProps> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={["8%", "30%"]} 
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default HintBottomSheet;