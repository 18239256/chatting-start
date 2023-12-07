const EmptyState = () => {
    return ( 
      <div 
        className="
          px-4 
          py-10 
          sm:px-6 
          lg:px-8 
          lg:py-6 
          h-full 
          flex 
          justify-center 
          items-center 
          bg-gray-100
        "
      >
        <div className="text-center items-center flex flex-col">
          <h3 className="mt-2 text-2xl font-semibold text-gray-300">
            没有开放共享的机器人
          </h3>
        </div>
      </div>
    );
  }
   
  export default EmptyState;