// react-native-flip-card.d.ts
declare module 'react-native-flip-card' {
    import { Component, ReactNode } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface FlipCardProps {
      style?: ViewStyle;
      friction?: number;
      perspective?: number;
      flipHorizontal?: boolean;
      flipVertical?: boolean;
      flip?: boolean;
      clickable?: boolean;
      alignHeight?: boolean;
      alignWidth?: boolean;
      useNativeDriver?: boolean;
      onFlipStart?: (isFlipStart: boolean) => void;
      onFlipEnd?: (isFlipEnd: boolean) => void;
      children?: ReactNode;  // Added children prop to allow React elements inside FlipCard
    }
  
    export default class FlipCard extends Component<FlipCardProps> {}
  }
  