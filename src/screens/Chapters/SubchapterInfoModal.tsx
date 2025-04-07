import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Animated, Linking } from 'react-native';
import { SubchapterInfoModalProps } from 'src/types/uiTypes';
import { scaleFontSize, screenWidth } from 'src/utils/screenDimensions';
import { Ionicons } from '@expo/vector-icons';

const SubchapterInfoModal: React.FC<SubchapterInfoModalProps> = ({
    visible,
    onClose,
    subchapterName,
    onReviewLesson,
    isJumpAhead = false,
    onJumpAheadConfirm,
    message,
    showPurchaseButton, // Prop hinzufügen
}) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.fullScreen}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[styles.modalView, { opacity }]}>
                            <Text style={styles.subchapterName}>{subchapterName}</Text>
                            <Text style={styles.description}>
                                {message || (isJumpAhead
                                    ? `Möchtest du mit ${subchapterName} weitermachen?`
                                    : 'Du hast diese Lektion abgeschlossen. Möchtest du sie wiederholen?')}
                            </Text>

                            {/* Kauf-Button anzeigen, wenn aktiviert */}
                            {showPurchaseButton && (
                                <TouchableOpacity
                                    style={styles.upgradeButtonSmall}
                                    onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.skilt.shk')}
                                >
                                    <Ionicons name="diamond-outline" size={20} color="#e8630a" style={styles.upgradeIconSmall} />
                                    <Text style={styles.upgradeTextSmall}>Alle Inhalte</Text>
                                </TouchableOpacity>
                            )}

                            {/* Wiederholen- oder Weiter-Button */}
                            {!message && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={isJumpAhead ? onJumpAheadConfirm : onReviewLesson}
                                >
                                    <Text style={styles.buttonText}>
                                        {isJumpAhead ? 'Weitermachen' : 'Wiederholen'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalView: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    subchapterName: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: screenWidth > 600 ? 22 : 18,
        fontWeight: 'bold',
    },
    description: {
        color: '#333',
        fontFamily: 'OpenSans-Regular',
        fontSize: screenWidth > 600 ? 22 : 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#343A40',
        borderRadius: 20,
        padding: screenWidth > 600 ? 14 : 10,
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: screenWidth > 600 ? 22 : 18,
    },
    purchaseButton: {
        backgroundColor: '#e8630a',
        marginVertical: 10,
    },
    upgradeButtonSmall: {
        marginTop: 10,
        marginBottom: 0,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderColor: '#e8630a',
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
    },
    upgradeTextSmall: {
        color: '#e8630a',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    upgradeIconSmall: {
        marginRight: 8,
    },
});

export default SubchapterInfoModal;





