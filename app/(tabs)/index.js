import { Text, View } from 'react-native';
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper'

export default function HomeScreen() {
  const [tickets, setTickets] = useState([])
  const [isTickets, setIsTickets] = useState(false)
  const [page, setPage] = useState(0)
  const [itemsPerPage, onItemsPerPageChange] = useState(2)
  
  async function fetchData() {
    try{
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
      
        if(error){
          throw new Error(error)
        }
        setTickets(data)

    }
    catch(error){
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(tickets)
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
      >
      <Text>Home Screen</Text>
      
      {tickets ?
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Created</DataTable.Title>
          <DataTable.Title>Description</DataTable.Title>
          <DataTable.Title>Location</DataTable.Title>
          <DataTable.Title>Color Code</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>

        {tickets.map((ticket) => {
          return(
          <DataTable.Row key={ticket.id}>
            <DataTable.Cell>{ticket.created_at}</DataTable.Cell>
            <DataTable.Cell>{ticket.description}</DataTable.Cell>
            <DataTable.Cell>{ticket.location}</DataTable.Cell>
            <DataTable.Cell>{ticket.color_code}</DataTable.Cell>
            <DataTable.Cell>{ticket.status}</DataTable.Cell>
          </DataTable.Row>
          )
        })}

        {/* <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(tickets.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          // label={`${from + 1}-${to} of ${tickets.length}`}
          numberOfItemsPerPageList={[2, 5, 7]}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        /> */}
      </DataTable>
      : <h1>No Tickets Found</h1>}
    </View>
  );
}
