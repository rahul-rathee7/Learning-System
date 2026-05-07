import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return <div className='w-full'>
        <div className='relative border-2 border-black bg-[#f7f2e8]'>
            <nav className='flex gap-2'>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(tab.name)}
                        className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transiton-all duration-200 ${activeTab === tab.name
                            ? 'text-black'
                            : 'text-neutral-700 hover:text-black'
                            }`}
                    >
                        <span className='relative z-10'>{tab.label}</span>
                        {activeTab === tab.name && (
                            <div className='absolute bottom-0 left-0 right-0 h-1 bg-black' />
                        )}
                        {activeTab === tab.name && (
                            <div className='absolute inset-0 bg-[#ffd400] -z-10' />
                        )}
                    </button>
                ))}
            </nav>
        </div>
        <div className='py-6'>
            {tabs.map((tab, index) => {
                if (tab.name === activeTab) {
                    return (
                        <div
                            key={index}
                            className='animate-in fade-in duration-300'
                        >
                            {tab.content}
                        </div>
                    );
                }
                return null;
            })}
        </div>
    </div>
}

export default Tabs;