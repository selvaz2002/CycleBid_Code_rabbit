import { Grid, Card, Table, TableRow, TableBody, TableCell, TableHead, CardHeader, CardContent, TableContainer } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CardActionAll from 'src/views/ui/cards/actions/CardActionAll'
import CardActionClose from 'src/views/ui/cards/actions/CardActionClose'
import CardActionRefresh from 'src/views/ui/cards/actions/CardActionRefresh'
import CardActionCollapse from 'src/views/ui/cards/actions/CardActionCollapse'

const CardActions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Card Actions' />
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='Card Actions'>
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell align='center'>Icon</TableCell>
                    <TableCell align='left'>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Collapse
                    </TableCell>
                    <TableCell align='center'>
                      <Icon icon='mdi:chevron-up' />
                    </TableCell>
                    <TableCell>Collapse card content using collapse action.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      Refresh Content
                    </TableCell>
                    <TableCell align='center'>
                      <Icon icon='mdi:refresh' />
                    </TableCell>
                    <TableCell>Refresh your card content using refresh action.</TableCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      Remove Card
                    </TableCell>
                    <TableCell align='center'>
                      <Icon icon='mdi:close' />
                    </TableCell>
                    <TableCell>Remove card from page using remove card action</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <CardActionCollapse />
      </Grid>
      <Grid item xs={12} md={6}>
        <CardActionRefresh />
      </Grid>
      <Grid item xs={12} md={6}>
        <CardActionClose />
      </Grid>
      <Grid item xs={12} md={6}>
        <CardActionAll />
      </Grid>
    </Grid>
  )
}

export default CardActions
