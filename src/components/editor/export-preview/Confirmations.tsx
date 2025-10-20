import React from 'react';

import ConfirmModal from '@/components/ui/ConfirmModal';

type Props = {
  confirmMatch: boolean;
  setConfirmMatch: (v: boolean) => void;
  onMatch: () => void;
  confirmApplyNaming: boolean;
  setConfirmApplyNaming: (v: boolean) => void;
  onApplyNaming: () => void;
  toast: string | null;
};

const Confirmations: React.FC<Props> = ({
  confirmMatch,
  setConfirmMatch,
  onMatch,
  confirmApplyNaming,
  setConfirmApplyNaming,
  onApplyNaming,
  toast,
}) => {
  return (
    <>
      <ConfirmModal
        open={confirmMatch}
        title='Match Filters from Options'
        message='Apply current Export Options back onto Preview filters? This will replace the current filter values in Preview.'
        onCancel={() => setConfirmMatch(false)}
        onConfirm={() => {
          setConfirmMatch(false);
          onMatch();
        }}
      />

      <ConfirmModal
        open={confirmApplyNaming}
        title='Apply Naming to Export Options'
        message='Apply the preview naming options (zip name and filename pattern) to Export Options?'
        onCancel={() => setConfirmApplyNaming(false)}
        onConfirm={() => {
          setConfirmApplyNaming(false);
          onApplyNaming();
        }}
      />

      {toast && (
        <div className='pointer-events-none fixed right-3 top-3 z-[60] rounded bg-gray-700 px-3 py-2 text-sm text-white shadow'>
          {toast}
        </div>
      )}
    </>
  );
};

export default Confirmations;
