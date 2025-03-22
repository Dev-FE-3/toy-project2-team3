import { FirebaseError } from 'firebase/app';

const FIREBASE_ERROR_MESSAGES: Record<
  string,
  { field: 'email' | 'password'; message: string }
> = {
  // 로그인 관련 오류
  'auth/invalid-credential': {
    field: 'password',
    message: '이메일 또는 비밀번호가 잘못되었습니다. 다시 입력해 주세요.',
  },
  'auth/too-many-requests': {
    field: 'email',
    message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  },
  'auth/network-request-failed': {
    field: 'email',
    message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.',
  },

  // 회원가입 관련 오류

  'auth/invalid-email': {
    field: 'email',
    message: '이메일 형식이 잘못되었습니다.',
  },
  'auth/weak-password': {
    field: 'password',
    message: '비밀번호를 6자 이상 입력해 주세요.',
  },

  default: {
    field: 'email',
    message: '오류가 발생했습니다. 다시 시도해 주세요.',
  },
};

export const handleFirebaseError = (
  error: unknown,
  setError: Function,
  setIsModalOpen?: Function
) => {
  const firebaseError = error as FirebaseError;

  // 이메일 중복 오류 시 모달을 띄우는 예외 처리
  if (firebaseError.code === 'auth/email-already-in-use' && setIsModalOpen) {
    setIsModalOpen(true);
    return;
  }

  const { field, message } =
    FIREBASE_ERROR_MESSAGES[firebaseError.code] ||
    FIREBASE_ERROR_MESSAGES.default;

  setError(field, { message });
};
