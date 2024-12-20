import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './pages/chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { DateAgoPipePipe } from 'src/app/_helpers/date-ago-pipe.pipe';
import { InboxFilterPipe } from 'src/app/_helpers/inbox-filter.pipe';
import { GroupByDayPipe } from 'src/app/_helpers/groupByDay.pipe';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ImageUplodComponent } from './components/image-uplod/image-uplod.component';
import { AudioComponent } from './components/audio/audio.component';
import { DocumentComponent } from './components/document/document.component';
import { VideoComponent } from './components/video/video.component';
import { LocationDetailsComponent } from './components/location-details/location-details.component';
import { QuickReplyComponent } from './components/quick-reply/quick-reply.component';
import { TempletsComponent } from './components/templets/templets.component';
import { TempletilterPipe } from 'src/app/_helpers/templet-filter';
import { ShortenFileNamePipe } from 'src/app/_helpers/ShortenFileName';
import { ReducePipe } from 'src/app/_helpers/reducefuction';
import { TotalPricePipe } from 'src/app/_helpers/total-price.pipe';
import { GoogleMapsModule } from '@angular/google-maps';
import { ParseFloatPipe } from 'src/app/_helpers/parseFloat.pipe';
import { WhitespaceValidatorDirective } from 'src/app/_helpers/whitespace-validator.directive';
import { CheckInComponent } from './components/check-in/check-in.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CatalogComponent } from './components/catalog/catalog.component';


@NgModule({
    declarations: [
        ChatComponent,
        DateAgoPipePipe,
        InboxFilterPipe,
        GroupByDayPipe,
        ImageUplodComponent,
        AudioComponent,
        DocumentComponent,
        VideoComponent,
        LocationDetailsComponent,
        QuickReplyComponent,
        TempletsComponent,
        TempletilterPipe,
        ShortenFileNamePipe,
        ParseFloatPipe,
        WhitespaceValidatorDirective,
        CheckInComponent,
        CatalogComponent

    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        PickerComponent,
        GoogleMapsModule,
        NgxExtendedPdfViewerModule,


    ]
})
export class ChatModule { }
