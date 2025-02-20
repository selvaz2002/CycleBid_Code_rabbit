import Link from 'next/link'
import { Grid, Card, Alert, Table, TableRow, TableHead, TableCell, TableBody, CardHeader, CardContent, TableContainer } from '@mui/material'
import { styled } from '@mui/material/styles'
import componentData from 'src/@fake-db/components/data'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))
const Misc = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='More Components' />
          <CardContent>
            <Alert severity='info' sx={{ mb: 4 }}>
              We have themed each of the MUI components but we have skipped the demos of the following components. User
              can always copy component's code and use from links given below.
            </Alert>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Components</TableCell>
                    <TableCell>Links</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {componentData.map((data, index) => (
                    <TableRow key={index} sx={{ '&:last-of-type .MuiTableCell-root ': { border: 0 } }}>
                      <TableCell>{data.component}</TableCell>
                      <TableCell>
                        <LinkStyled href={data.link} target='_blank'>
                          {data.link}
                        </LinkStyled>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Misc
