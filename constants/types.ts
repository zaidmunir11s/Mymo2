import { StyleProp, TextProps, TextStyle } from "react-native";

export type StyledTextProps = TextProps & {
  type?: "body" | "heading" | "narrow" | "button" | "subHeading" | "small" | "title";
  weight?: 400 | 500 | 600;
  textStyle?: StyleProp<TextStyle>;
  children?: any;
  color?: string;
  fontSize?: number;
  shadow?: boolean;
};
