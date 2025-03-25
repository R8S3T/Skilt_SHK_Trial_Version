// src/types/react-native-swiper.d.ts

declare module 'react-native-swiper' {
    import { ComponentType } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';

        interface SwiperProps {
        showsButtons?: boolean;
        loop?: boolean;
        showsPagination?: boolean;
        index?: number;
        horizontal?: boolean;
        style?: StyleProp<ViewStyle>;
        onIndexChanged?: (index: number) => void;
        children?: React.ReactNode;
    }

        const Swiper: ComponentType<SwiperProps>;
        export default Swiper;
}
