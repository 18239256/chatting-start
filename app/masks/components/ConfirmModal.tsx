'use client';

import React, { useCallback, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modals/Modal';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';
import { RobotMask } from '@prisma/client';

interface ConfirmModalProps {
  mask: RobotMask;
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  mask,
  isOpen, 
  onClose 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios.delete(`/api/mask/${mask.id}`)
      .then(() => {
        router.refresh();
      })
      .catch(() => toast.error('出错了!'))
      .finally(() => setIsLoading(false));
  }, [router, mask, onClose]);

  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div 
          className="
            mx-auto 
            flex 
            h-12 
            w-12 
            flex-shrink-0 
            items-center 
            justify-center 
            rounded-full 
            bg-red-100 
            sm:mx-0 
            sm:h-10 
            sm:w-10
          "
        >
          <FiAlertTriangle 
            className="h-6 w-6 text-red-600" 
            aria-hidden="true"
          />
        </div>
        <div 
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title 
            as="h3" 
            className="text-base font-semibold leading-6 text-gray-900"
          >
            删除岗位
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              确认删除此岗位定义？删除操作将不能恢复。
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          disabled={isLoading}
          danger
          onClick={onDelete}
        >
          删除
        </Button>
        <Button
          disabled={isLoading}
          secondary
          onClick={onClose}
        >
          取消
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal;