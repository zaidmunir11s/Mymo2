import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { DynamicSize } from "./helpers";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  selfCenter: {
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  row_sp_bt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  items_center: {
    alignItems: "center",
    justifyContent: "center",
  },
  pad_ho: {
    paddingHorizontal: 20,
  },
  content_container: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  page: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: "hidden",
    flex: 1,
  },
  smallBadge: {
    height: 20,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dragHandle: {
    height: DynamicSize(5),
    width: DynamicSize(36),
    borderRadius: 100,
    backgroundColor: Colors.tint,
  },
  dragHandleContainer: {
    height: 26,
    paddingTop: DynamicSize(6),
    alignItems: "center",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon_7_12_res : {
    width: DynamicSize(7),
    height: DynamicSize(12),
  },
  icon_11_res: {
    width: DynamicSize(11),
    height: DynamicSize(11),
  },
  icon_12_res: {
    width: DynamicSize(12),
    height: DynamicSize(12),
  },
  icon_14_res: {
    width: DynamicSize(14),
    height: DynamicSize(14),
  },
  icon_16: {
    width: 16,
    height: 16,
  },
  icon_16_res: {
    width: DynamicSize(16),
    height: DynamicSize(16),
  },
  icon_18_res: {
    width: DynamicSize(18),
    height: DynamicSize(18),
  },
  icon_20: {
    width: 20,
    height: 20,
  },
  icon_20_res: {
    width: DynamicSize(20),
    height: DynamicSize(20),
  },
  icon_24: {
    width: 24,
    height: 24,
  },
  icon_24_res: {
    width: DynamicSize(24),
    height: DynamicSize(24),
  },
  icon_32: {
    width: 32,
    height: 32,
  },
  icon_32_res: {
    width: DynamicSize(32),
    height: DynamicSize(32),
  },
  icon_40_res: {
    width: DynamicSize(40),
    height: DynamicSize(40),
  },
  icon_48_res: {
    width: DynamicSize(48),
    height: DynamicSize(48),
  },
  icon_56_res: {
    width: DynamicSize(56),
    height: DynamicSize(56),
  },
  icon_80_res: {
    width: DynamicSize(80),
    height: DynamicSize(80),
  },
  icon_86_res: {
    width: DynamicSize(86),
    height: DynamicSize(86),
  },
  icon_40: {
    width: 40,
    height: 40,
  },
  seperator: {
    height: 16,
    width: "100%",
  },
  secondaryBtn: {
    borderWidth: 1,
  },
  primaryBtn: {
    borderWidth: 1,
    height: 48,
  },
  lightBadge: {},
  greenBadge: {},
  crownIcon: { width: 12, height: 12 },
  pad_ver: { paddingVertical: 20 },
  mt_8: {
    marginTop: DynamicSize(8),
  },
  mt_28: {
    marginTop: DynamicSize(28),
  },
  mt_24: {
    marginTop: DynamicSize(24),
  },
  mt_12: {
    marginTop: DynamicSize(12),
  },
  pt_12: {
    paddingTop: DynamicSize(12),
  },
  mt_3: {
    marginTop: DynamicSize(3),
  },
  ml_8: {
    marginLeft: DynamicSize(8),
  },
  gap_6: {
    gap: DynamicSize(6),
  },
  gap_8: {
    gap: DynamicSize(8),
  },
  gap_10: {
    gap: DynamicSize(10),
  },
  gap_12: {
    gap: DynamicSize(12),
  },
  gap_24: {
    gap: DynamicSize(24),
  },
  gap_4: {
    gap: DynamicSize(4),
  },
  align_self_center: {
    alignSelf: "center",
  },
  longHandle: {
    height: DynamicSize(5),
    width: DynamicSize(48),
    borderRadius: 100,
    backgroundColor: Colors.grey_50,
  },
});
