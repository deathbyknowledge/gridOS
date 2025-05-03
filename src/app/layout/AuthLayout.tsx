const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        // <div className="bg-background min-h-screen min-w-screen bg-[url('/images/landscape-mj.png')] bg-cover bg-center">
        <div className="bg-background min-h-screen min-w-screen">
            <div className="grid grid-cols-[2fr_1fr] min-h-screen">
                <div className="bg-[url('/images/square-subtle.png')] bg-cover bg-center">
                    {/* <div className="bg-cover bg-center"> */}
                    {/* <img src="/images/logo.svg" alt="Apply Wize" /> */}
                    {/* <div>
                        Apply Wize
                    </div> */}
                </div>
                <div className="center relative">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export { AuthLayout }