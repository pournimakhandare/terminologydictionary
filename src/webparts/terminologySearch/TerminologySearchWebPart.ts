import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TerminologySearchWebPartStrings';
import TerminologySearch from './components/TerminologySearch';
import { ITerminologySearchProps } from './components/ITerminologySearchProps';

import { sp } from '@pnp/sp';

export interface ITerminologySearchWebPartProps {
  description: string;
}

export default class TerminologySearchWebPart extends BaseClientSideWebPart<ITerminologySearchWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITerminologySearchProps> = React.createElement(
      TerminologySearch,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {  
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
