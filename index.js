import { connect } from 'react-redux';
import React, { Component } from 'react';
import axios from 'axios';
import { Platform, StatusBar, AppRegistry, View, StyleSheet, Image, Clipboard, TextInput, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Body, Title, Button, Item, Icon, Input, Form, Textarea } from 'native-base';

import { isWebUri } from 'valid-url';
import Expo from 'expo';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import * as settings from './../../utils/settings';


const access_token = "Change it to appp real access_token";

const headers = {
  authorization: access_token ? `Bearer ${access_token}` : null
};

const client = new ApolloClient({
  uri: settings.API_BASE_GRAPHQL_URL,
  headers: headers
});




const mapStateToProps = state => {
  return {

  }
};

const dispatchToProps = dispatch => {
  return {
  }
};

class Discover extends React.Component {
  constructor(props) {
    super(props);
    this.sendArticle = this.sendArticle.bind(this);
    this.state = {
      clipboardContent: null,
      url: '',
      name: '',
      description: '',
      keywords: ''
    };
    this.fetchArticles();
  }

  componentDidMount() {
    // console.log(this);
    // Clipboard.getString().then(
    //   (content) => {
    //     console.log(content);
    //     if (isWebUri(content)) {
    //       axios.get(content)
    //         .then(res => {
    //           console.log(res);
    //           console.log(res.status);
    //           if (res.status == '200') {
    //             this.setState({ clipboardContent: content });
    //           }
    //         })
    //     }
    //   });

  }

  _onPressSubmit = () => {
    this.sendArticle();
  }

  sendArticle() {
   
    client.mutate({      
      mutation: gql`
        mutation newArticle($url: String, $name: String!, $description: String!, $keywords: [String!]!){
          createArticle 
            (
              input: {
                url: $url, 
                name: $name, 
                description: $description, 
                keywords: $keywords
              }
            ) {
              id
          }
        }
      `,
      variables: {
        "url": this.state.url,
        "name": this.state.name,
        "description": this.state.description,
        "keywords": this.state.keywords
      },
    })
      .then((result) => {
        this.fetchArticles(result);
        // console.log('got result: ', result);
      }).catch((error) => {
        console.log('there was an error sending the query: ', error);
      });
  }

  fetchArticles = (result) => {
    // console.log(result);
    client.query({
      query: gql`
      {
        fetchArticles {
          id
          description
          url
          name
          keywords
        }
      }
      `,
    })
      .then((result) => {
        // console.log('got result: ', result);
      }).catch((error) => {
        console.log('there was an error sending the query: ', error);
      });
  }

  render() {
    return (
      <Container>
        <Header>
          <Body><Title>Submit a link</Title></Body>
        </Header>
        <Content padder>
          <Form>
            <Text>Url :</Text>
            <Input placeholder="URL" bordered value={this.state.url} />
            <Text>Name :</Text>
            <Input placeholder="Name" bordered value={this.state.name} />
            <Text>Description :</Text>
            <Input placeholder="Description" bordered value={this.state.description} />
            <Text>Keywords :</Text>
            <Input placeholder="Keywords" bordered value={this.state.keywords} />
          </Form>
          <TouchableOpacity bordered onPress={this._onPressSubmit}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default connect(mapStateToProps, dispatchToProps)(Discover);
