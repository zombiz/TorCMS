# -*- coding:utf-8 -*-

'''
listing the posts, simply.
'''

import tornado.escape
import tornado.web

from config import CMS_CFG
from torcms.core import tools
from torcms.core.base_handler import BaseHandler
from torcms.model.post2catalog_model import MPost2Catalog
from torcms.model.post_model import MPost


class PostListHandler(BaseHandler):
    '''
    listing the posts, simply.
    '''

    def initialize(self):
        super(PostListHandler, self).initialize()

    def get(self, *args):

        url_str = args[0]
        url_arr = self.parse_url(url_str)

        if url_str in ['_recent', 'recent']:
            self.recent()
        # elif url_arr[0] == 'p_recent':
        #     self.p_recent(url_arr[1])
        elif url_str == '_refresh':
            self.refresh()

        elif url_str == 'errcat':
            self.errcat()
        else:
            kwd = {
                'info': '404. Page not found!',
            }
            self.render('misc/html/404.html', kwd=kwd,
                        userinfo=self.userinfo, )

    def recent(self, with_catalog=True, with_date=True):
        '''
        List posts that recent edited.
        :param with_catalog:
        :param with_date:
        :return:
        '''
        kwd = {
            'pager': '',
            'unescape': tornado.escape.xhtml_unescape,
            'title': 'Recent posts.',
            'with_catalog': with_catalog,
            'with_date': with_date,
        }
        self.render('list/post_list.html',
                    kwd=kwd,
                    view=MPost.query_recent(num=20),
                    postrecs=MPost.query_recent(num=2),
                    format_date=tools.format_date,
                    userinfo=self.userinfo,
                    cfg=CMS_CFG, )

    # def p_recent(self, kind, with_catalog=True, with_date=True):
    #     '''
    #     List posts that recent edited, partially.
    #     :param with_catalog:
    #     :param with_date:
    #     :return:
    #     '''
    #     kwd = {
    #         'pager': '',
    #         'unescape': tornado.escape.xhtml_unescape,
    #         'title': 'Recent posts.',
    #         'with_catalog': with_catalog,
    #         'with_date': with_date,
    #     }
    #     self.render('admin/post_p/post_p_list.html',
    #                 kwd=kwd,
    #                 postrecs=MPost.query_recent(num=20),
    #                 format_date=tools.format_date,
    #                 userinfo=self.userinfo,
    #                 cfg=CMS_CFG, )

    def errcat(self):
        '''
        List the posts to be modified.
        :return:
        '''
        post_recs = MPost.query_random(limit=1000)
        outrecs = []
        errrecs = []
        idx = 0
        for postinfo in post_recs:
            if idx > 16:
                break
            cat = MPost2Catalog.get_first_category(postinfo.uid)
            if cat:
                if 'def_cat_uid' in postinfo.extinfo and (
                            postinfo.extinfo['def_cat_uid'] == cat.tag_id):
                    pass
                else:
                    errrecs.append(postinfo)
                    idx += 1
            else:
                outrecs.append(postinfo)
                idx += 1
        self.render('list/errcat.html',
                    kwd={},
                    norecs=outrecs,
                    errrecs=errrecs,
                    userinfo=self.userinfo)

    def refresh(self):
        '''
        List the post of dated.
        :return:
        '''
        kwd = {
            'pager': '',
            'title': '',
        }
        self.render('post_{0}/post_list.html',
                    kwd=kwd,
                    userinfo=self.userinfo,
                    view=MPost.query_dated(10),
                    postrecs=MPost.query_dated(10),
                    format_date=tools.format_date,
                    unescape=tornado.escape.xhtml_unescape,
                    cfg=CMS_CFG, )
