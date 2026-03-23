import Button from 'components/Button';
import DataPreview from 'components/DataPreview';
import Modal from 'components/modal/Modal';
import { NextPage } from 'next';
import { useState } from 'react';
import OShape from 'images/o_shape.svg';

const HomePage: NextPage = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center py-16 gap-6 relative min-h-[100vh]">
      <div className={'fixed inset-0 -z-20 bg-grey-1000 '}>
        {<OShape className="fixed -top-40 right-10 -z-10" />}
      </div>

      <div>
        <img className="mx-autoblock w-[310px] h-[64px] mb-[90px] mx-auto" src={'/logo/demant/logo.svg'} alt={'Demant logo'} />
      </div>
      <DataPreview data={{
        email: '',
        clinic: [
          '',
        ],
        acceptedTerms: false
      }}
      />

      <div className={'w-[600px]'}>
        <Button className={'w-full'} onClick={() => setIsModalVisible(true)} label={'Show modal'} />

        <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <div className="grid grid-cols-2 min-h-[400px]" id="form-content">
            <div>
              Form
            </div>

            <div>
              Image
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;
