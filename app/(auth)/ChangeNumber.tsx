import ChangeNumberPage from '@/components/pages/Profile/ChangeNumberPage'
import PageWrapper from '@/components/wrapper/PageWrapper'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

type Props = {}

const ChangeNumber = (props: Props) => {
  return (
    <PageWrapper>
        <StatusBar style='dark'/>
        <ChangeNumberPage/>
    </PageWrapper>
  )
}

export default ChangeNumber