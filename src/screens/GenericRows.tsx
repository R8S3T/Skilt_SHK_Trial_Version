import React from 'react';
import { View, StyleSheet } from 'react-native';
import GenericNode from './GenericNode';

interface GenericRowsProps {
    items: {
        id: number;
        title: string;
        isLocked: boolean;
        isFinished: boolean;
    }[];
    onNodePress: (id: number, title: string) => void;
    color: string;
    finishedColor: string;
}

const GenericRows: React.FC<GenericRowsProps> = ({ items, onNodePress, color, finishedColor }) => {
    return (
        <View style={styles.container}>
            {items.map(item => (
                <GenericNode
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    isLocked={item.isLocked}
                    isFinished={item.isFinished}
                    onPress={() => onNodePress(item.id, item.title)}
                    color={color}
                    finishedColor={finishedColor}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginHorizontal: 20,
    },
});


export default GenericRows;
