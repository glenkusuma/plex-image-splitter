import EditorButtonCollection from '@/components/editor/EditorButtonCollection';
import EditorImageInput from '@/components/editor/EditorImageInput';
import UnderlineLink from '@/components/links/UnderlineLink';

const EditorSidebar = () => {
  return (
    <div className='flex h-screen w-full flex-col bg-gray-900 px-4 py-4 text-white'>
      <div className='sticky top-0 z-20 bg-gray-900 pb-2 pt-1'>
        <img
          src='/images/svg/Logo.svg'
          alt='logo'
          className='mx-auto w-24'
          style={{ filter: 'brightness(100)' }}
        />
      </div>
      <div className='scrollbar-hide flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-4'>
        <EditorImageInput />
        <EditorButtonCollection />
        <footer className='border-gray-700 pt-1 text-center text-xs'>
          <p className='pt-4 text-center'>
            Created by{' '}
            <UnderlineLink href='https://github.com/omargfh'>
              Omar Ibrahim
            </UnderlineLink>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EditorSidebar;
