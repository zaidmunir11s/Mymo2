import ManageAlertPage from '@/components/pages/ManageAlert'
import PageWrapper from '@/components/wrapper/PageWrapper'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

type Props = {}

const ManageAlert = (props: Props) => {
  return (
    <PageWrapper>
        <StatusBar style='dark'/>
        <ManageAlertPage/>
    </PageWrapper>
  )
}

export default ManageAlert