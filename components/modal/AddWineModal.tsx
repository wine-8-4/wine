'use client';

import { postWineDetail, uploadWineImage } from '@/api/wines.api';
import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../common/Button';
import Dropdown from '../common/dropdown/Dropdown';
import Input from '../common/Input';
import Modal from './Modal';
import WineImageInput from './WineImageInput';

type FormValues = {
  name: string;
  price: number;
  region: string;
  type: string;
  image: File | null;
};

type ModalProps = {
  isOpen: boolean;
  onClick: () => void;
  initialFormValue: FormValues | (() => FormValues);
};

function AddWineModal({ isOpen, onClick, initialFormValue }: ModalProps) {
  const [formValue, setFormValue] = useState<FormValues>(initialFormValue);
  const [postError, setPostError] = useState('');

  const wineOption = [
    { label: 'RED', value: 'RED' },
    { label: 'WHITE', value: 'WHITE' },
    { label: 'SPARKLING', value: 'SPARKLING' },
  ];

  const handleFormChange = (
    name: string,
    value: string | number | File | null
  ) => {
    setFormValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleFormChange(name, value);
  };

  const handleSelect = (value: string | number) => {
    handleFormChange('type', value); // 와인 타입을 선택할 때 상태 업데이트
  };

  const checkAllInputsFilled = () => {
    return (
      formValue.name !== '' &&
      formValue.price !== 0 &&
      formValue.region !== '' &&
      formValue.image !== null
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = '';
    console.log(formValue);

    try {
      // 이미지 파일이 있을 때 업로드 진행
      if (formValue.image) {
        imageUrl = await uploadWineImage(formValue.image);
      }

      const wineData = {
        name: formValue.name,
        region: formValue.region,
        price: Number(formValue.price),
        type: formValue.type,
        image: imageUrl,
      };

      // 와인 정보 POST 요청
      await postWineDetail(wineData);
      setFormValue(initialFormValue); // 폼 값을 초기 상태로 되돌리기
      setPostError(''); // 에러 초기화
    } catch (error) {
      console.error('와인 등록에 실패했습니다:', error);
      setPostError('와인 등록에 실패했습니다. 다시 시도해 주세요.'); // 에러 메시지 설정
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClick}>
      <section className="mb-[40px] flex items-center justify-between mob:mb-[30px]">
        <h1 className="font-sans text-2xl font-bold text-gray-800">
          와인 등록
        </h1>
        <button
          type="button"
          onClick={onClick}
          className="text-2xl text-gray-500 mob:text-xl"
        >
          X
        </button>
      </section>
      <form className="mb-[32px] w-[412px] mob:w-full" onSubmit={handleSubmit}>
        {postError && <p className="text-red-500">{postError}</p>}{' '}
        {/* 에러 메시지 표시 */}
        <Input
          label="와인 이름"
          id="name"
          name="name"
          placeholder="와인 이름 입력"
          style={{ marginBottom: '32px', width: '100%', height: '48px' }}
          onChange={handleInputChange}
        />
        <Input
          label="가격"
          id="price"
          name="price"
          type="number"
          placeholder="가격 입력"
          style={{ marginBottom: '32px', width: '100%', height: '48px' }}
          onChange={handleInputChange}
        />
        <Input
          label="원산지"
          id="region"
          name="region"
          placeholder="원산지 입력"
          style={{ marginBottom: '32px', width: '100%', height: '48px' }}
          onChange={handleInputChange}
        />
        <h2 className="mb-[10px] font-sans text-lg font-medium text-gray-800">
          타입
        </h2>
        <Dropdown
          options={wineOption}
          onSelect={handleSelect}
          type="select"
          initialLabel="RED"
        />
        <br />
        <br />
        <WineImageInput
          name="image"
          value={formValue.image}
          onChange={handleFormChange}
        />
        <div className="mt-[32px] flex gap-[5px]">
          <Button
            buttonStyle="box"
            buttonWidth="fitToChildren"
            buttonColor="lightPurple"
            textColor="purple"
            style={{ flexGrow: '1' }}
            onClick={onClick}
          >
            취소
          </Button>
          <Button
            buttonStyle="box"
            buttonWidth="fitToChildren"
            buttonColor="purple"
            textColor="white"
            style={{ flexGrow: '2' }}
            disabled={!checkAllInputsFilled()}
          >
            와인 등록하기
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddWineModal;
