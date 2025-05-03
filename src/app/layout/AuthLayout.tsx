const AuthLayout = ({ children, isSignup = false }: { children: React.ReactNode, isSignup?: boolean }) => {
    return (
        <div className={"bg-background min-h-screen min-w-screen bg-cover bg-center " + (isSignup ? "bg-[url('/images/landscape-mj.png')]" : "")} >
            <div className="grid grid-cols-[2fr_1fr] min-h-screen">
                <div className={!isSignup ? "bg-[url('/images/square-subtle.png')] bg-cover bg-center" : ""}>
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