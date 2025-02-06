import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import UserList from "../user/UserList";
import ArtistList from "../artist/ArtistList";


export function TabsCustomAnimation({ user }) {

  const data = [
    {
      label: "Users",
      value: "users",
      desc: `It`,
    },
    {
      label: "Artists",
      value: "artists",
      desc: `Bec`,
    },

  ];

  return (
    <>

      {user.role === 'super_admin' ?

        <Tabs id="custom-animation" value="users" >
          <TabsHeader
            className="max-w-[400px] "
          >
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { y: 250 },
              mount: { y: 0 },
              unmount: { y: 250 },
            }}
          >
            {data.map(({ value, desc }) => (
              <TabPanel key={value} value={value}>
                {value === "users" ? <UserList /> : <ArtistList />}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs> :
        <div>

          <ArtistList />
        </div>
      }
    </>
  );
}