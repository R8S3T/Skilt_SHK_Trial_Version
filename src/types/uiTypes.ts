export type SubchapterInfoModalProps = {
    visible: boolean;
    onClose: () => void;
    subchapterName: string;
    onReviewLesson: () => void;
    isJumpAhead?: boolean;
    onJumpAheadConfirm?: () => void;
    message?: string | null;
};
