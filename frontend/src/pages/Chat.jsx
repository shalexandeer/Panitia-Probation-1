import Card from "./../components/Card";

const Chat = () => {
    return (
        <div className="bg-[#FAFCFE]">
            <div className="container mx-auto grid grid-cols-[30%_1fr] pt-11 gap-14">
                <div className="flex flex-col gap-9">
                    <SearchInput />
                    <ChatList />
                </div>
:               <div className="border rounded-[1rem_!important]">
                    <Card className={"rounded-[1rem_!important]  "}>
                        <Card.Body>
                            <div>
                                <ConsultantCard
                                    className={"p-[2rem_4rem_1rem_3rem]"}
                                    showDivider={false}
                                />
                                <div className={`divider m-[0px_!important]`}></div>
                            </div>
                            <ChatMessage className={"p-[2rem_4rem_1rem_3rem] h-[1000px]"} />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SearchInput = () => {
    return (
        <input placeholder="search" className="p-3 border w-full rounded-lg">
        </input>
    );
};

const ChatList = () => {
    return (
        <Card
            className={"border rounded-[1rem_!important] p-5 flex flex-col gap-6"}
        >
            <Card.Title text="Consultant" />
            <Card.Body className={"flex flex-col gap-5"}>
                <ConsultantCard />
                <ConsultantCard />
                <ConsultantCard />
            </Card.Body>
        </Card>
    );
};

const ConsultantCard = ({ className, showDivider }) => {
    return (
        <div className={`${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-11">
                            <span className="text-3xl">K</span>
                        </div>
                    </div>{" "}
                    <div id="consultant-information">
                        <ConsultantName />
                        <ConsultantMessage />
                    </div>
                </div>
                <ConsultantStatus />
            </div>
            <div
                className={`divider m-[0px_!important] pt-4 ${showDivider == false && "hidden"
                    } `}
            >
            </div>
        </div>
    );
};

const ConsultantName = () => {
    return <h1>Name</h1>;
};

const ConsultantMessage = () => {
    return <p>Consultantmessage</p>;
};

const ConsultantStatus = () => {
    return <h1>ongoing</h1>;
};

const ChatMessage = ({ className }) => {
    return (
        <div className={`${className}`}>
            <h1>lagi apa</h1>
        </div>
    );
};
export default Chat;
